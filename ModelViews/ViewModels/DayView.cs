using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelViews.ViewModels
{
	public class DayView
	{
		public required string SyllabusId { get; set; }
		public int Order { get; set; }
	}
}
