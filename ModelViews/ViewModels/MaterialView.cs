using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelViews.ViewModels
{
	public class MaterialView
	{
		public required string Title { get; set; }
		
		public required string Source { get; set; }
		
		public required string ContentId { get; set; }
	}
}
