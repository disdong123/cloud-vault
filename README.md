# Cloud vault

[aws-vault](https://github.com/99designs/aws-vault) 따라하기

### 테스트 과정

- [x] user 생성
- [x] policy 없이 s3 접근
- [x] policy attach 후 s3 접근
- [ ] role 없이 s3 접근
- [ ] role attach 후 s3 접근
- [ ] instance profile 검증
- [ ] default credential chain 검증
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