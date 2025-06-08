import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample events data
  const [events] = useState([
    { id: 1, title: 'Parent-Teacher Meeting', date: '2023-06-15', type: 'meeting' },
    { id: 2, title: 'End of Term Exams', date: '2023-06-30', type: 'exam' },
    { id: 3, title: 'School Holiday', date: '2023-07-04', type: 'holiday' },
    { id: 4, title: 'Field Trip', date: '2023-06-20', type: 'event' },
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventTypeClass = (type) => {
    const typeClasses = {
      meeting: 'bg-blue-100 text-blue-800',
      exam: 'bg-red-100 text-red-800',
      holiday: 'bg-yellow-100 text-yellow-800',
      event: 'bg-green-100 text-green-800',
    };
    return typeClasses[type] || 'bg-gray-100 text-gray-800';
  };

  // Get the starting day of the month (0-6, where 0 is Sunday)
  const startDay = monthStart.getDay();
  
  // Create array of empty cells for days before the first day of the month
  const emptyStartCells = Array.from({ length: startDay }, (_, i) => (
    <div key={`empty-start-${i}`} className="h-24 border border-gray-100"></div>
  ));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage school events and schedules
          </p>
        </div>
        <Button as={Link} to="/events/new">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
            >
              Today
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevMonth}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextMonth}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-white p-2 text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first of the month */}
          {emptyStartCells}
          
          {/* Calendar days */}
          {monthDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-24 p-2 border border-gray-100 bg-white ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${
                    isToday ? 'flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                  {dayEvents.slice(0, 2).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${getEventTypeClass(event.type)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Events */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Events for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="flex items-start p-3 border border-gray-100 rounded-lg">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getEventTypeClass(event.type)}`}>
                    {event.type === 'meeting' && <Users className="h-5 w-5" />}
                    {event.type === 'exam' && <span>!</span>}
                    {event.type === 'holiday' && <span>✈️</span>}
                    {event.type === 'event' && <span>★</span>}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), 'h:mm a')} • {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No events scheduled for this day.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalendarPage;
