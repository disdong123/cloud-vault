resource "aws_iam_user" "user" {
  name = var.user_name
  tags = {
    name = var.tag_creator
    env = var.tag_env
  }
}

resource "aws_iam_user_policy_attachment" "user_policy_attachment" {
  user        = aws_iam_user.user.name
  count       = length(var.policy_arn_list)
  policy_arn  = var.policy_arn_list[count.index]
}