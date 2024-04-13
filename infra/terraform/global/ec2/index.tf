resource "aws_instance" "ec2" {
  ami = var.ami
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name = aws_key_pair.ec2_keypair.key_name
  iam_instance_profile = var.iam_instance_profile_name
  tags = {
    Name = var.name
    name = var.tag_creator
    env = var.tag_env
  }
}

resource "tls_private_key" "ec2_key" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "ec2_keypair" {
  key_name   = var.keypair_name
  public_key = tls_private_key.ec2_key.public_key_openssh
}

resource "local_file" "ec2_key_pem" {
  content  = tls_private_key.ec2_key.private_key_pem
  file_permission = "0400"
  filename = var.keypair_filename
}

resource "aws_security_group" "ec2_sg" {
  name = var.sg_name
  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.name
    name = var.tag_creator
    env = var.tag_env
  }
}