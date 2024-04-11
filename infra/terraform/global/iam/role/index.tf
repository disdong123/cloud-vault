resource "aws_iam_role" "role" {
  name = var.role_name

  assume_role_policy = jsonencode(var.assume_role_policy)

  tags = {
    name = var.tag_creator
    env = var.tag_env
  }
}

resource "aws_iam_role_policy_attachment" "role_policy_attachment" {
  role        = aws_iam_role.role.name
  count       = length(var.policy_arn_list)
  policy_arn  = var.policy_arn_list[count.index]
}