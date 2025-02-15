﻿using DevOpsExmaProject.Mp3WebApi.Entitys;
using DevOpsExmaProject.Mp3WebApi.Repositorise.Abstracts;
using DevOpsExmaProject.Mp3WebApi.Services.Abstracts;
using System.Linq.Expressions;

namespace DevOpsExmaProject.Mp3WebApi.Services.Concretes
{
    public class UserService : IUserService
    {
        private readonly IUserDal _userDal;

        public UserService(IUserDal userDal)
        {
            this._userDal = userDal;
        }

        public async Task AddAsync(User entity)
        {
            await _userDal.AddAsync(entity);
        }

        public async Task DeleteAsync(User entity)
        {
            await _userDal.DeleteAsync(entity);
        }

        public async Task<User> GetAsync(Expression<Func<User, bool>> filter)
        {
            return await _userDal.GetAsync(filter);
        }

        public async Task<List<User>> GetListAsync(Expression<Func<User, bool>>? filter = null)
        {
            return await _userDal.GetListAsync(filter);
        }

        public async Task UpdateAsync(User entity)
        {
            await _userDal.UpdateAsync(entity);
        }
    }
}
