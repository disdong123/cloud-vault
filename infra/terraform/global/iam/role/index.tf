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
  name = var.role_name
  role = aws_iam_role.role.name
}

# TODO
#  count 때문에 * 로 해야하니다.
#  이 때문에 사용하는 쪽에서도 [0] 을 선택해야 하는데, instance_profile 이 만들어지지 않는 role 에서 [0] 을 접근하는 경우 문제가 생길 수 있습니다.
#  instance_profile 을 count 로 분기치는 것이 아닌 module 로 나누는 것이 좋아보입니다.
output "role_instance_profile_name" {
  value = aws_iam_instance_profile.role_instance_profile.*.name
}