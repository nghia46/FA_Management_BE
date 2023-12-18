using Services.Interfaces;
using AutoMapper;
using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Repository.Service;
using Tools.Tools;
using CsvHelper;
using System.Globalization;
using Repository.CsvClassMap;
using Repository.Repositories;
using Repository.Interface;
using CsvHelper.Configuration;

namespace Services.Services
{
    public class SyllabusService : ISyllabusService
    {
        private readonly IMapper _mapper;
        private readonly ISyllabusRepository _syllabusRepository;
        private readonly IUserRepository _userRepository;

        public SyllabusService(IMapper mapper, ISyllabusRepository syllabusRepository, IUserRepository userRepos)
        {
            _mapper = mapper;
            _syllabusRepository = syllabusRepository;
            _userRepository = userRepos;
        }

        public async Task<Syllabus> AddSyllabus(SyllabusCreateView syllabusView, string userId)
        {
            IEnumerable<User> users = await _userRepository.GetByFilterAsync(u => u.Id.Equals(userId));
            if (!users.Any())
            {
                throw new Tools.Tools.CustomException.InternalServerErrorException($"User with id {userId} not found");
            }
            Syllabus syllabus = _mapper.Map<Syllabus>(syllabusView);
            syllabus.Id = IdGenerator.GenerateId();
            syllabus.ModifiedBy = userId;
            syllabus.ModifiedOn = DateOnly.FromDateTime(DateTime.Now);
            return await _syllabusRepository.AddOneItem(syllabus);
        }
        public async Task<List<Syllabus>> AddSyllabusCSV(SyllabusImportCsvView syllabusImportCsv, string userId)
        {
            IEnumerable<User> users = await _userRepository.GetByFilterAsync(u => u.Id.Equals(userId));
            if (!users.Any())
            {
                throw new CustomException.InternalServerErrorException($"User with id {userId} not found");
            }
            using var streamReader = new StreamReader(syllabusImportCsv.CsvFile.OpenReadStream());
            using var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture);
            csvReader.Context.RegisterClassMap<SyllabusClassMap>();
            IEnumerable<Syllabus> syllabusList = csvReader.GetRecords<Syllabus>().ToList();
            return syllabusImportCsv.DuplicateHandleMethod switch
            {
                ImportHandleMethod.Create => await AddSyllabusCreateMethod(syllabusList, userId),
                ImportHandleMethod.Replace => await AddSyllabusReplaceMethod(syllabusList, syllabusImportCsv.DuplicateCheckField, userId),
                ImportHandleMethod.Skip => await AddSyllabusSkipMethod(syllabusList, syllabusImportCsv.DuplicateCheckField, userId),
                _ => throw new CustomException.InvalidDataException($"Invalid ${"DuplicateHandleMethod"}"),
            };
        }
        private async Task<List<Syllabus>> AddSyllabusCreateMethod(IEnumerable<Syllabus> syllabusList, string operatorId)
        {
            List<Syllabus> addList = new();
            foreach (Syllabus syllabusView in syllabusList)
            {
                Syllabus syl = _mapper.Map<Syllabus>(syllabusView);
                syl.Id = IdGenerator.GenerateId();
                syl.ModifiedBy = operatorId;
                syl.ModifiedOn = DateOnly.FromDateTime(DateTime.Now);
                syl.Status = SyllabusStatus.Draft;
                addList.Add(syl);
            }
            return await _syllabusRepository.AddManyItem(addList);
        }
        private async Task<List<Syllabus>> AddSyllabusReplaceMethod(IEnumerable<Syllabus> syllabusList, List<string> fields, string operatorId)
        {
            List<Syllabus> addList = new();
            bool checkName = fields.Contains("Name");
            bool checkCode = fields.Contains("Code");
            if (!checkName && !checkCode)
            {
                throw new Tools.Tools.CustomException.InvalidDataException("DuplicateCheckField must have at least one field name");
            }
            foreach (Syllabus syllabusView in syllabusList)
            {
                string? name = checkName ? syllabusView.Name : null;
                string? code = checkCode ? syllabusView.Code : null;
                if (await _syllabusRepository.CountSyllabusByNameAndCodeAsync(name, code) == 0)
                {
                    Syllabus syl = _mapper.Map<Syllabus>(syllabusView);
                    syl.Id = IdGenerator.GenerateId();
                    syl.ModifiedBy = operatorId;
                    syl.ModifiedOn = DateOnly.FromDateTime(DateTime.Now);
                    syl.Status = SyllabusStatus.Draft;
                    addList.Add(await _syllabusRepository.AddOneItem(syl));
                }
                else
                {
                    Syllabus syllabus = await _syllabusRepository.GetSyllabusByNameAndCodeAsync(name, code);
                    syllabus.Status = syllabusView.Status;
                    syllabus.Name = syllabusView.Name;
                    syllabus.Code = syllabusView.Code;
                    syllabus.ModifiedOn = DateOnly.FromDateTime(DateTime.Now);
                    syllabus.ModifiedBy = operatorId;
                    syllabus.Status = SyllabusStatus.Draft;
                    addList.Add(await _syllabusRepository.UpdateItemByValue(syllabus.Id, syllabus));
                }
            }
            return addList;
        }
        private async Task<List<Syllabus>> AddSyllabusSkipMethod(IEnumerable<Syllabus> syllabusList, List<string> fields, string operatorId)
        {
            List<Syllabus> addList = new();
            bool checkName = fields.Contains("Name");
            bool checkCode = fields.Contains("Code");
            if (!checkName && !checkCode)
            {
                throw new CustomException.InvalidDataException("DuplicateCheckField must have at least one field name");
            }
            foreach (Syllabus syllabusView in syllabusList)
            {
                string? name = checkName ? syllabusView.Name : null;
                string? code = checkCode ? syllabusView.Code : null;
                
                if (await _syllabusRepository.CountSyllabusByNameAndCodeAsync(name, code) == 0)
                {
                    Syllabus syl = _mapper.Map<Syllabus>(syllabusView);
                    syl.Id = IdGenerator.GenerateId();
                    syl.ModifiedBy = operatorId;
                    syl.ModifiedOn = DateOnly.FromDateTime(DateTime.Now);
                    syl.Status = SyllabusStatus.Draft;
                    addList.Add(await _syllabusRepository.AddOneItem(syl));
                }
            }
            return addList;
        }
        public async Task<object> GetAll(
            int page,
            int pageSize,
            int sortOrder,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            IEnumerable<string>? searchValues)
        {
            int skip = (page - 1) * pageSize;
            long totalCount = await _syllabusRepository.CountPagedFilteredAsync(startDate, endDate, searchValues);
            bool isAsc = (sortOrder == 1);
            IEnumerable<Syllabus> syllabusList = await _syllabusRepository.GetPagedFilteredAsync(skip, pageSize, isAsc, sortField, startDate, endDate, searchValues);
            IEnumerable<SyllabusListView> syllabusListViews = _mapper.Map<IEnumerable<SyllabusListView>>(syllabusList);
            IEnumerable<User> users = await _userRepository.GetAllAsync();
            foreach (SyllabusListView syllabusListView in syllabusListViews)
            {
                syllabusListView.ModifiedBy = users.Single(u=>u.Id.Equals(syllabusListView.ModifiedBy)).Name;
            }
            var response = new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Syllabus = syllabusListViews
            };
            return response;
        }
        public async Task<Syllabus> GetSyllabusById(string id)
        {
            IEnumerable<Syllabus> filteredSyllabusList = await _syllabusRepository.GetByFilterAsync(s=>s.Id.Equals(id));
            if (!filteredSyllabusList.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Syllabus with Id {id} not found");
            }
            return filteredSyllabusList.First();
        }
        public async Task<bool> RemoveSyllabus(string id)
        {
            IEnumerable<Syllabus> filteredSyllabusList = await _syllabusRepository.GetByFilterAsync(s => s.Id == id);
            if (!filteredSyllabusList.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Syllabus with Id {id} not found");
            }
            return await _syllabusRepository.RemoveItemByValue(id);

        }
        public async Task<Syllabus> UpdateSyllabus(string id, SyllabusCreateView syllabusView)
        {
            IEnumerable<Syllabus> filteredSyllabusList = await _syllabusRepository.GetByFilterAsync(s => s.Id.Equals(id));
            if (!filteredSyllabusList.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Syllabus with Id {id} not found");
            }
            Syllabus oldSyllabus = filteredSyllabusList.First();
            Syllabus syllabus = _mapper.Map<Syllabus>(syllabusView);
            syllabus.ModifiedBy = oldSyllabus.ModifiedBy;
            syllabus.ModifiedOn = oldSyllabus.ModifiedOn;
            syllabus.Id = id;
            return await _syllabusRepository.UpdateItemByValue(id, syllabus);
        }
        public Task<byte[]> ExportSyllabus(List<Syllabus> syllabusList)
        {
            using var memoryStream = new MemoryStream();
            using var streamWriter = new StreamWriter(memoryStream);
            using var csvWriter = new CsvWriter(streamWriter, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true
            });
            csvWriter.Context.RegisterClassMap<SyllabusClassMap>();
            csvWriter.WriteRecords(syllabusList);
            streamWriter.Flush();

            return Task.FromResult(memoryStream.ToArray());
        }
    }
}
