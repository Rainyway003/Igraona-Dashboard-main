import {Calendar, Tooltip} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useList } from '@refinedev/core';

interface CalendarComponentProps {
  selectedDates: Dayjs[];
  setSelectedDates: (dates: Dayjs[]) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
                                                               selectedDates,
                                                               setSelectedDates,
                                                             }) => {
  const { data: reservedData } = useList({
    resource: 'reserve',
  });


  const reservedDates = useMemo(() => {
    const list = (reservedData?.data || []).map((item) => {
      const dateObj = typeof item.date === 'object' && item.date?.toDate
          ? item.date.toDate()
          : new Date(item.date);

      const formatted = dayjs(dateObj).startOf('day').format('YYYY-MM-DD');
      return formatted;
    });

    console.log("Ev:", list);
    return list;
  }, [reservedData]);


  const onSelect = (date: Dayjs) => {
    const formatted = date.startOf("day").format("YYYY-MM-DD");

    if (reservedDates.includes(formatted)) {
      console.warn("⛔ Datum je rezerviran:", formatted);
      return;
    }

    if (selectedDates.some((d) => d.isSame(date, 'day'))) {
      setSelectedDates(selectedDates.filter((d) => !d.isSame(date, 'day')));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };



  console.log(reservedData?.data);


  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  const now = dayjs()

  return (
      <Calendar
          fullscreen={true}
          onSelect={onSelect}
          value={undefined}
          disabledDate={(date) => {
            const formatted = date.startOf('day').format('YYYY-MM-DD');
            return date.isBefore(now.startOf('day')) || reservedDates.includes(formatted);
          }}
          dateCellRender={(date) => {
            const formatted = date.startOf("day").format("YYYY-MM-DD");
            const isReserved = reservedDates.includes(formatted);
            const isSelected = selectedDates.some((d) => d.isSame(date, 'day'));

            let style: React.CSSProperties = {
              width: '50%',
              height: '40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontWeight: 'bold',
              margin: '0 auto',
            };

            if (isReserved) {
              style.backgroundColor = '#8D151F';
              style.color = '#fff';
            } else if (isSelected) {
              style.backgroundColor = '#b5212d';
              style.color = '#fff';
            }

            const cellContent = (
                <div style={style}>
                  {isReserved ? '✖️' : isSelected ? '✔️' : null}
                </div>
            );

            return isReserved ? (
                <Tooltip title="Ovaj datum je već rezerviran">{cellContent}</Tooltip>
            ) : cellContent;
          }}
      />
  );
};

export default CalendarComponent;