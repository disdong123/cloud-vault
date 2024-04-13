# Cloud vault

[aws-vault](https://github.com/99designs/aws-vault) 의 주요 기능을 만들어봅니다.

### instance-metadata test

aws-vault 는 서버와 같이 지속적으로 임시 자격 증명이 필요한 상황을 위해 instance-metadata 를 모방한 기능을 제공하고 있습니다.

[instance-metadata](./docs/instance-metadata.md) 를 이해하기 위해 테스트를 진행합니다.

- [x] user 생성
  - [x] policy 없이 s3 접근
  - [x] policy attach 후 s3 접근
- [x] role 생성
  - [x] role 없이 s3 접근
  - [x] role 을 assume 한 후 s3 접근
- [x] ec2 및 instance profile 생성
  - [x] instance-profile 없이 IMDS 요청
  - [x] instance-profile 적용 후 IMDS 접근
- [x] credential provider chain 검증
- [ ] web identity token 검증
- [ ] eks instance profile 검증
- [ ] eks service account 검증
- [ ] sdk 로 검증

### TODO

- Test SDK 
- https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials-chain.html
- --ecs-server: https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/auth/credentials/ContainerCredentialsProvider.html
- --ec2-server: https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/auth/credentials/InstanceProfileCredentialsProvider.html
- Use keychain for credentials