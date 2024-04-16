# Cloud vault

[aws-vault](https://github.com/99designs/aws-vault) 의 주요 기능을 만들어봅니다.

### How it works

aws-vault 는 IMDS 와 credentials provider chain 을 이용하여 자격 증명을 관리합니다.

[이를](./docs/instance-metadata.md) 이해하기 위해 몇가지 테스트를 진행합니다.
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

### Todo

- https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials-chain.html
- --ecs-server: https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/auth/credentials/ContainerCredentialsProvider.html
- --ec2-server: https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/auth/credentials/InstanceProfileCredentialsProvider.html
- Use keychain for credentials