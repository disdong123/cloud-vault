terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.4.0"
    }
  }

  required_version = ">= 1.3"
}

provider "aws" {
  shared_credentials_files = ["$HOME/.aws/credentials"]
  region     = var.region
}

variable "region" {
  default = "ap-northeast-2"
}

variable "user_policy_arn_list" {
  default = [
    "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  ]
}

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