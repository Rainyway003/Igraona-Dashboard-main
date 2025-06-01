import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useList } from '@refinedev/core';

interface CalendarComponentProps {
  selectedDates: Dayjs[];
  setSelectedDates: (dates: Dayjs[]) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDates, setSelectedDates }) => {
  const { data: reservedData } = useList({
    resource: 'reserve',
  });

  const reservedDates = useMemo(() => {
    return (reservedData?.data || []).map((item) =>
      dayjs(item.startingAt).format('YYYY-MM-DD')
    );
  }, [reservedData]);

  const onSelect = (date: Dayjs) => {
    const formatted = date.format('YYYY-MM-DD');
    if (reservedDates.includes(formatted)) {
      return;
    }

    if (selectedDates.some(d => d.isSame(date, 'day'))) {
      setSelectedDates(selectedDates.filter(d => !d.isSame(date, 'day')));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  return (
    <Calendar
      fullscreen={true}
      onSelect={onSelect}
      dateCellRender={(date) => {
        const isReserved = reservedDates.includes(date.format('YYYY-MM-DD'));
        return isReserved ? (
          <div style={{ backgroundColor: '#8D151F', borderRadius: '50%', width: '8px', height: '8px', margin: 'auto' }} />
        ) : null;
      }}
    />
  );
};

export default CalendarComponent;
