# instance-metadata

role 과 instance profile, 그리고 instance metadata 에 대해 알아봅니다.

### role

role 은 user 와 마찬가지로 policy 를 통해 특정 리소스에 대한 권한을 보유합니다. 다만 user 와 달리, role 은 누군가가 맡을(assume) 수 있습니다.

role 의 trust-relationship 영역에 특정 user, aws 서비스 등의 특정 리소스를 설정하면 해당 리소스는 role 의 입장에서 신뢰할 수 있는 상태가 되고, 리소스는 role 을 맡을 수 있게 됩니다.
(aws 에서 신뢰할 수 있다는 것은 콘솔에 로그인한 상태, 실행되고 있는 aws 리소스 혹은 access/secret key 로 인증한 상태를 의미합니다.)
```terraform
variable "assume_role_policy" {
  default = {
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AssumeRoleTest"
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::574166935152:user/user-role"
        },
      },
    ]
  }
}
```

만약 위 처럼 user-role 이라는 user 가 role 의 trust-relationship 에 설정되어 있고, user-role 의 access/secret key 를 통해 SDK 에 Credentials 을 제공한 상태라면 role 을 assume 하여 role 에 정의된 권한을 수행할 수 있게 됩니다. 

### instance metadata

instance metadata 는 hostname, profile, security-group 등 실행 중인 인스턴스를 관리하는 데 사용할 수 있는 인스턴스 관련 데이터로, ec2 가 생성되면 ec2 instance metadata 가 자동으로 연결되어 정보를 제공합니다.

일반적으로 aws, gcp, azure 등의 클라우드 서비스는 IMDS(instance metadata service) 의 ip 를 link-local-address 중 하나인 169.254.169.254 를 이용합니다. 실제 ec2 내에서 아래와 같이 요청하면 응답결과를 확인할 수 있습니다.

(link-local-address 는 사설 IP 대역과 비슷하게 특수한 목적으로 설계된 IP 대역으로, RFC 6890에 정의되어 있으며 169.254.0.0/16 을 이용합니다. 이는 직접 연결된 하위 네트워크 내에서만 유효한 주소로, 외부에서 접근할 수 없습니다.)

```
curl http://169.254.169.254/latest/meta-data
```

IMDS 를 이용하면 ec2 에 연결된 role 을 통해 임시 자격 증명을 가져올 수 있습니다. 이를 위해서는 instance profile 이 있는 role 을 생성하고 ec2 에 연결해야합니다.
연결할 때, role 의 trust-relationship 에는 반드시 ec2 관련 설정이 포함되어야 합니다.
```
variable "ec2_assume_role_policy" {
  default = {
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Ec2AssumeRoleTest"
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  }
}
```

연결한 후 /latest/meta-data/iam/security-credentials 로 요청하면 연결되어있는 instance-profile 이름을 줍니다. 

```
# 요청
curl http://169.254.169.254/latest/meta-data/iam/security-credentials

# 응답
role-with-instance-profile
```

얻어온 instance-profile 이름을 이용하여 아래와 같이 요청하면 최종적으로 임시 자격 증명을 가져올 수 있습니다. (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#instance-metadata-security-credentials)

```
# 요청
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-with-instance-profile

# 결과
{
  "Code" : "Success",
  "LastUpdated" : "2024-04-13T16:59:56Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIAYLLYEEZYD4*******",
  "SecretAccessKey" : "irfl1GZtHXs2daAB****************************",
  "Token" : "IQoJb3JpZ2luX2VjEEEaDmFwLW5vcnRoZWFzdC0yIkcwRQIgQGuDCGDjBzXM/FKn**********************************************************************",
  "Expiration" : "2024-04-13T23:35:14Z"
}
```

실제로 ec2 내에서 awscli 를 사용한 모습을 디버그 로그를 찍어보면 위와 같이 IMDS 를 사용하는 것을 확인할 수 있습니다.

```
aws s3 ls --debug

# debug
...
2024-04-14 03:25:26,571 - MainThread - urllib3.connectionpool - DEBUG - Starting new HTTP connection (1): 169.254.169.254:80
2024-04-14 03:25:26,573 - MainThread - urllib3.connectionpool - DEBUG - http://169.254.169.254:80 "PUT /latest/api/token HTTP/1.1" 200 56
2024-04-14 03:25:26,574 - MainThread - urllib3.connectionpool - DEBUG - Resetting dropped connection: 169.254.169.254
2024-04-14 03:25:26,576 - MainThread - urllib3.connectionpool - DEBUG - http://169.254.169.254:80 "GET /latest/meta-data/iam/security-credentials/ HTTP/1.1" 200 26
2024-04-14 03:25:26,576 - MainThread - urllib3.connectionpool - DEBUG - Resetting dropped connection: 169.254.169.254
2024-04-14 03:25:26,578 - MainThread - urllib3.connectionpool - DEBUG - http://169.254.169.254:80 "GET /latest/meta-data/iam/security-credentials/role-with-instance-profile HTTP/1.1" 200 1610
2024-04-14 03:25:26,578 - MainThread - botocore.credentials - DEBUG - Found credentials from IAM Role: role-with-instance-profile
...
```

만약 role 의 trust-relationship 에 ec2 관련 설정이 없는 경우 AssumeRoleUnauthorizedAccess 예외가 발생합니다. (https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_iam-ec2.html#troubleshoot_iam-ec2_errors-info-doc.)

```
# 요청
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role

# 결과
{
  "Code": "AssumeRoleUnauthorizedAccess",
  "Message": "~~"
}
```

또한, instance-profile 을 연결하지 않은 ec2 에서 /latest/meta-data/iam/security-credentials 로 요청하면 아래와 같이 Not Found 예외가 발생합니다.

```
# 요청
curl http://169.254.169.254/latest/meta-data/iam/security-credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-with-instance-profile

# 응답
<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
 <head>
  <title>404 - Not Found</title>
 </head>
 <body>
  <h1>404 - Not Found</h1>
 </body>
</html>
```

### credential providers chain

수많은 SDK 에서 일관된 방식으로 자격 증명을 할 수 있게 [Standardized credential providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html) 를 제공하고 있습니다. 이 방식들은 기본적으로 Credential provider chain 에 따라 우선순위가 정해지게 됩니다.

instance-profile 이외에 어떠한 설정도 하지 않았다면 IMDS 를 이용합니다.

만약 ec2 인스턴스 내에서 aws configure 를 이용하여 access/secret key 를 등록한 상태 혹은 어플리케이션에서 별도의 정책을 이용하고 있다면 Credential provider chain 의 우선순위로 인해 IMDS 를 사용하지 않습니다.


