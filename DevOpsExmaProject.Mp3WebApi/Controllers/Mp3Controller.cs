﻿using DevOpsExmaProject.Mp3WebApi.Dtos;
using DevOpsExmaProject.Mp3WebApi.Dtos.Mp3Dtos;
using DevOpsExmaProject.Mp3WebApi.Entitys;
using DevOpsExmaProject.Mp3WebApi.Services.Abstracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DevOpsExmaProject.Mp3WebApi.Controllers
{
    [Route("Mp3")]
    [Authorize]
    [ApiController]
    public class Mp3Controller : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IMp3Service _mp3Service;

        private readonly IConfiguration _configuration;
        private readonly IColudinaryService _coludinaryService;
        private readonly IRedisService _redisService;
        private readonly IRabbitMQService _rabbitMQService;
        private readonly IFileService _fileService;

        public Mp3Controller(IUserService userService, IMp3Service mp3Service, IConfiguration configuration, IColudinaryService coludinaryService, IRedisService redisService, IRabbitMQService rabbitMQService, IFileService fileService)
        {
            _userService = userService;
            _mp3Service = mp3Service;
            _configuration = configuration;
            _coludinaryService = coludinaryService;
            _redisService = redisService;
            _rabbitMQService = rabbitMQService;
            _fileService = fileService;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(AddMp3Dto dto)
        {
            try
            {
                Mp3 mp3 = new Mp3()
                {
                    Name = dto.Name,
                    ImageUrl = await _fileService.UploadImageAsync(new LocalAddFile() { File = dto.ImageFile }),
                    SoundUrl = await _coludinaryService.UploadMp3Async(new ClodinaryAddFile() { File = dto.Mp3File }),
                    UserId = dto.UserId,
                    LikeCount = 0,
                };

                await _mp3Service.AddAsync(mp3);

                return Ok("true");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"File upload error: {ex.Message}");
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, $"Permission error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("Mp3s")]
        public async Task<IActionResult> Mp3s(string userId, string mp3Name = "*")
        {

            if (mp3Name == "*")
            {
                var mp3List = await _mp3Service.GetListAsync();

                List<GetMp3Dto> list = new();

                foreach (var mp3 in mp3List.Take(50))
                {
                    User user = await _userService.GetAsync(u => u.Id == mp3.UserId);


                    list.Add(new GetMp3Dto()
                    {
                        Id = mp3.Id,
                        Name = mp3.Name,
                        LikeCount = mp3.LikeCount,
                        ImageUrl = mp3.ImageUrl,
                        SoundUrl = mp3.SoundUrl,
                        Favorite = _redisService.CheckFavorite(userId!, mp3.Id),
                        OwnerName = user.UserName


                    });
                }

                return Ok(list);
            }
            else
            {
                var mp3List = await _mp3Service.GetListAsync(m => m.Name!.ToLower().Contains(mp3Name.ToLower()));

                var filterMp3List = mp3List
                .OrderByDescending(m => m.Name!.ToLower().StartsWith(mp3Name.ToLower()))
                .ThenBy(m => m.Name).Take(50);


                List<GetMp3Dto> list = new();

                foreach (var mp3 in filterMp3List)
                {

                    User user = await _userService.GetAsync(u => u.Id == mp3.UserId);


                    list.Add(new GetMp3Dto()
                    {
                        Id = mp3.Id,
                        Name = mp3.Name,
                        LikeCount = mp3.LikeCount,
                        ImageUrl = mp3.ImageUrl,
                        SoundUrl = mp3.SoundUrl,
                        Favorite = _redisService.CheckFavorite(userId!, mp3.Id),
                        OwnerName = user.UserName


                    });
                }


                return Ok(list);
            }
        }


        [HttpGet("Popular")]
        public async Task<IActionResult> Popular(string userId)
        {

            var mp3List = await _mp3Service.GetListAsync();

            var top10Mp3 = mp3List
                .OrderByDescending(m => m.LikeCount)
                .Take(8)
                .ToList();

            List<GetMp3Dto> list = new();

            foreach (var mp3 in top10Mp3)
            {
                User user = await _userService.GetAsync(u => u.Id == mp3.UserId);


                list.Add(new GetMp3Dto()
                {
                    Id = mp3.Id,
                    Name = mp3.Name,
                    LikeCount = mp3.LikeCount,
                    ImageUrl = mp3.ImageUrl,
                    SoundUrl = mp3.SoundUrl,
                    Favorite = _redisService.CheckFavorite(userId!, mp3.Id),
                    OwnerName = user.UserName


                });
            }

            return Ok(list);
        }

        [HttpPost("AddLikeMp3")]
        public async Task<IActionResult> AddLikeMp3(int mp3Id)
        {

            Mp3 mp3 = await _mp3Service.GetAsync(m => m.Id == mp3Id);

            mp3.LikeCount++;

            await _mp3Service.UpdateAsync(mp3);

            return Ok("true");
        }


        [HttpGet("MyMp3s")]
        public async Task<IActionResult> MyMp3s(string userId)
        {
            var mp3List = await _mp3Service.GetListAsync(m => m.UserId == userId);

            List<GetMp3Dto> list = new();

            foreach (var mp3 in mp3List)
            {
                User user = await _userService.GetAsync(u => u.Id == mp3.UserId);


                list.Add(new GetMp3Dto()
                {
                    Id = mp3.Id,
                    Name = mp3.Name,
                    LikeCount = mp3.LikeCount,
                    ImageUrl = mp3.ImageUrl,
                    SoundUrl = mp3.SoundUrl,
                    Favorite = _redisService.CheckFavorite(userId!, mp3.Id),
                    OwnerName = user.UserName


                });
            }

            return Ok(list);
        }

        [HttpGet("Favorites")]
        public async Task<IActionResult> Favorites(string? userId)
        {
            var mp3List = await _mp3Service.GetListAsync(m => m.UserId == userId);

            List<GetMp3Dto> list = new();

            foreach (var mp3 in mp3List)
            {

                if (_redisService.CheckFavorite(userId!, mp3.Id))
                {
                    User user = await _userService.GetAsync(u => u.Id == mp3.UserId);

                    list.Add(new GetMp3Dto()
                    {
                        Id = mp3.Id,
                        Name = mp3.Name,
                        LikeCount = mp3.LikeCount,
                        ImageUrl = mp3.ImageUrl,
                        SoundUrl = mp3.SoundUrl,
                        Favorite = _redisService.CheckFavorite(userId!, mp3.Id),
                        OwnerName = user.UserName

                    });
                }
            }

            return Ok(list);
        }

        [HttpPost("AddComment")]
        public async Task<IActionResult> AddComment(AddMp3CommentDto dto)
        {

            User user = await _userService.GetAsync(u => u.Id == dto.UserId);

            await _rabbitMQService.AddMp3Comment(user.UserName!, dto.Mp3Id, dto.Comment!);

            return Ok("true");
        }

        [HttpGet("Mp3Comments")]
        public async Task<IActionResult> Mp3Comments(int mp3Id)
        {
            if (mp3Id <= 0)
            {
                return BadRequest("Invalid mp3Id provided.");
            }

            var comments = await _rabbitMQService.GetMp3Comments(mp3Id);
            return Ok(comments);
        }


        [HttpPost("ChangeFavorite")]
        public IActionResult ChangeFavorite(int mp3Id, string userId)
        {

            _redisService.ChangeFavorite(userId!, mp3Id);

            return Ok("true");
        }


    }
}
