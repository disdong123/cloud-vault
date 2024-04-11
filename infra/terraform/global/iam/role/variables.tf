variable "tag_creator" {
  default = "disdong"
}

variable "tag_env" {
  default = "cloud-vault"
}

variable "role_name" {}

variable "policy_arn_list" {
  default = []
}

variable "assume_role_policy" {
  default = {
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  }
}