﻿namespace DevOpsExmaProject.Mp3WebApi.Dtos.Mp3Dtos
{
    public class AddMp3CommentDto
    {
        public string? UserId { get; set; }
        public int Mp3Id { get; set; }
        public string? Comment { get; set; }
    }
}
