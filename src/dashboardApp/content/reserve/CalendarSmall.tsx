import {Calendar, Tooltip} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {useEffect, useMemo} from 'react';
import {useList} from '@refinedev/core';

interface CalendarComponentProps {
  selectedDates: Dayjs[];
  setSelectedDates: (dates: Dayjs[]) => void;
}

const CalendarSmall: React.FC<CalendarComponentProps> = ({
                                                           selectedDates,
                                                           setSelectedDates,
                                                         }) => {
  const {data: reservedData} = useList({
    resource: 'reserve',
  });

  const reservedDates = useMemo(() => {
    const list = (reservedData?.data || []).map((item) => {
      const dateObj = typeof item.vrijeme === 'object' && item.vrijeme?.toDate
        ? item.vrijeme.toDate()
        : new Date(item.vrijeme);

      return {
        vrijeme: dayjs(dateObj).startOf('day').format('YYYY-MM-DD'),
        name: item.name,
      }
    });

    return list;
  }, [reservedData]);

  console.log(reservedDates)

  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  const now = dayjs()

  return (
    <Calendar
      style={{
        width: '100%',
        maxWidth: '1000px',
        height: '20%',
        margin: '0 auto',
        padding: '16px',
        borderRadius: '10px',
        paddingRight: '100px',
        marginTop: '16px',
      }}
      className="pointer-important"
      fullscreen={true}
      value={undefined}
      disabledDate={() => true}
      dateCellRender={(date) => {
        const formatted = date.startOf("day").format("YYYY-MM-DD");
        const reservedEntry = reservedDates.find((d) => d.vrijeme === formatted);
        const isReserved = !!reservedEntry;
        const isSelected = selectedDates.some((d) => d.isSame(date, 'day'));


        const style: React.CSSProperties = {
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
          <Tooltip title={`Rezervirao : ${reservedEntry.name}`}>{cellContent}</Tooltip>
        ) : cellContent;
      }}
    />
  );
};

export default CalendarSmall;