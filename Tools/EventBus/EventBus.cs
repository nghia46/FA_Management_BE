﻿namespace Tools.EventBus
{
    public class EventBus : IEventBus
    {
        public event EventHandler<Event>? EventPublished;
        public void Publish(Event @event)
        {
            OnEventPublished(@event);
        }
        protected virtual void OnEventPublished(Event @event)
        {
            EventPublished?.Invoke(this, @event);
        }
    }
}
