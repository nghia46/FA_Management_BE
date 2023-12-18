using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools.EventBus
{
    public interface IEventBus
    {
        event EventHandler<Event>? EventPublished;
        void Publish(Event @event);
    }
}
