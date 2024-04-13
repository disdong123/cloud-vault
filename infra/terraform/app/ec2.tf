module "cloud-vault" {
  source = "../global/ec2"

  keypair_name = "cloud_vault_keypair"
  keypair_filename = "cloud_vault_keypair.pem"
  sg_name = "cloud_vault_sg"
  iam_instance_profile_name = module.role-with-instance-profile.role_instance_profile_name[0] # TODO
}