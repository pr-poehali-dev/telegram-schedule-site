import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Event = {
  id: number;
  title: string;
  time: string;
  date: string;
  description: string;
  color: string;
  isFavorite: boolean;
  notification: boolean;
};

type TabType = 'schedule' | 'notifications' | 'search' | 'favorites';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Встреча с командой',
      time: '10:00',
      date: '2026-01-06',
      description: 'Обсуждение новых проектов',
      color: 'bg-primary',
      isFavorite: true,
      notification: true,
    },
    {
      id: 2,
      title: 'Презентация проекта',
      time: '14:30',
      date: '2026-01-06',
      description: 'Демонстрация результатов',
      color: 'bg-secondary',
      isFavorite: false,
      notification: true,
    },
    {
      id: 3,
      title: 'Обед с партнёрами',
      time: '12:00',
      date: '2026-01-06',
      description: 'Деловой обед в центре',
      color: 'bg-accent',
      isFavorite: true,
      notification: false,
    },
    {
      id: 4,
      title: 'Тренировка',
      time: '18:00',
      date: '2026-01-07',
      description: 'Спортзал',
      color: 'bg-primary',
      isFavorite: false,
      notification: true,
    },
  ]);

  const toggleFavorite = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, isFavorite: !event.isFavorite } : event
    ));
  };

  const toggleNotification = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, notification: !event.notification } : event
    ));
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'favorites') return event.isFavorite;
    if (activeTab === 'notifications') return event.notification;
    if (activeTab === 'search') return event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return event.date === selectedDate.toISOString().split('T')[0];
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const tabs = [
    { id: 'schedule' as TabType, label: 'Расписание', icon: 'Calendar' },
    { id: 'notifications' as TabType, label: 'Уведомления', icon: 'Bell' },
    { id: 'search' as TabType, label: 'Поиск', icon: 'Search' },
    { id: 'favorites' as TabType, label: 'Избранное', icon: 'Star' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Расписание</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Icon name="Plus" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-auto animate-slide-up">
                <DialogHeader>
                  <DialogTitle>Новое событие</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Название события" />
                  <Input type="time" />
                  <Input type="date" />
                  <Textarea placeholder="Описание" rows={3} />
                  <Button className="w-full">Создать</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {activeTab === 'schedule' && (
          <div className="p-4 bg-card border-b animate-fade-in">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Сегодня</p>
                <p className="font-semibold">{formatDate(selectedDate)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-4 bg-card border-b animate-fade-in">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск событий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <main className="p-4 space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {activeTab === 'favorites' && 'Нет избранных событий'}
                {activeTab === 'notifications' && 'Нет событий с уведомлениями'}
                {activeTab === 'search' && 'Событий не найдено'}
                {activeTab === 'schedule' && 'Нет событий на эту дату'}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden transition-all hover:shadow-lg animate-scale-in"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-1 h-12 rounded-full', event.color)} />
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.time} • {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleNotification(event.id)}
                      >
                        <Icon
                          name={event.notification ? 'Bell' : 'BellOff'}
                          size={16}
                          className={event.notification ? 'text-primary' : 'text-muted-foreground'}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(event.id)}
                      >
                        <Icon
                          name="Star"
                          size={16}
                          className={event.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex gap-2 mt-3">
                    {event.notification && (
                      <Badge variant="secondary" className="text-xs">
                        <Icon name="Bell" size={12} className="mr-1" />
                        Push
                      </Badge>
                    )}
                    {event.isFavorite && (
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Star" size={12} className="mr-1" />
                        Избранное
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
          <div className="max-w-md mx-auto flex justify-around items-center h-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all',
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon
                  name={tab.icon as any}
                  size={24}
                  className={cn(
                    'transition-transform',
                    activeTab === tab.id && 'scale-110'
                  )}
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Index;