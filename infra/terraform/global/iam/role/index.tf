resource "aws_iam_role" "role" {
  name = var.role_name

  assume_role_policy = jsonencode(var.assume_role_policy)

  tags = {
    name = var.tag_creator
    env = var.tag_env
  }
}

resource "aws_iam_role_policy_attachment" "role_policy_attachment" {
  count       = length(var.policy_arn_list)
  role        = aws_iam_role.role.name
  policy_arn  = var.policy_arn_list[count.index]
}

resource "aws_iam_instance_profile" "role_instance_profile" {
  count = var.create_instance_profile ? 1 : 0
  name = var.role_instance_profile_name
  role = aws_iam_role.role.name
}