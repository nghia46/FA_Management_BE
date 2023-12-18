using AutoMapper;
using Models.Models;
using ModelViews.ViewModels;

namespace FA_BACK_END.Profile_Maper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserView>().ReverseMap();
            CreateMap<User, GoogleUser>().ReverseMap();
            CreateMap<User, UserUpdateView>().ReverseMap();
            CreateMap<User, UserRegisterView>().ReverseMap();
            CreateMap<Location, LocationView>().ReverseMap();
            CreateMap<Class, ClassView>().ReverseMap();
            CreateMap<Attendee, AttendeeView>().ReverseMap();
            CreateMap<Syllabus, SyllabusCreateView>().ReverseMap();
            CreateMap<Syllabus, SyllabusListView>()
                .ForMember(des => des.Duration, opt => opt.MapFrom(scr => TimeSpan.FromMinutes(scr.TrainingTime).TotalDays))
                .ForMember(des => des.OutputStandard, opt => opt.MapFrom(scr => scr.OutputStandard))
                .ForMember(des => des.Status, opt => opt.MapFrom(scr => scr.Status.ToString()));
            CreateMap<Trainee, TraineeView>().ReverseMap();
            CreateMap<UserRole, UserRoleView>().ReverseMap();
            CreateMap<UserRole, UserRolePermissionView>().ReverseMap();
            CreateMap<TrainingProgram, TrainingProgramView>().ReverseMap();
            CreateMap<Feature, FeatureView>().ReverseMap();
            CreateMap<FeaturePermission, FeaturePermissionView>().ReverseMap();
            CreateMap<WaitingActivate, UserRegisterView>().ReverseMap();
        }
    }
}
