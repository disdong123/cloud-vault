module "user-without-policy" {
  source = "../global/iam/user"

  user_name       = "user-without-policy"
}

module "user-with-policy" {
  source = "../global/iam/user"

  user_name       = "user-with-policy"
  policy_arn_list = var.user_policy_arn_list
}

module "user-role" {
  source = "../global/iam/user"

  user_name       = "user-role"
}

module "role" {
  source = "../global/iam/role"

  role_name       = "role"
  assume_role_policy = var.assume_role_policy
  policy_arn_list = var.user_policy_arn_list
}