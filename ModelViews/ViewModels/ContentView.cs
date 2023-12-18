using Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelViews.ViewModels
{
    public class ContentView
    {
        public required string Name { get; set; }
        public required string Code { get; set; }
        public int TrainingTime { get; set; }
        public bool  Status { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public required string UnitId { get; set; }

    }
}
