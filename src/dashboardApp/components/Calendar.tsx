import React, {useState} from 'react';
import {Calendar, theme, Typography} from 'antd';
import type {Dayjs} from 'dayjs';

type Props = {
  onDateSelect: (range: { start: string; end: string }) => void;
};

const CalendarComponent: React.FC<Props> = ({onDateSelect}) => {
  const {token} = theme.useToken();

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onSelect = (date: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      onDateSelect({start: date.format('YYYY-MM-DD'), end: date.format('YYYY-MM-DD')});
    } else if (startDate && !endDate) {
      if (date.isBefore(startDate)) {
        setEndDate(startDate);
        setStartDate(date);
        onDateSelect({start: date.format('YYYY-MM-DD'), end: startDate.format('YYYY-MM-DD')});
      } else {
        setEndDate(date);
        onDateSelect({start: startDate.format('YYYY-MM-DD'), end: date.format('YYYY-MM-DD')});
      }
    }
  };

  const disabledDate = (currentDate: Dayjs) => {
    const today = currentDate.clone().startOf('day');
    const now = currentDate.clone();
    return currentDate.isBefore(new Date(), 'day');
  };

  const cellRender = (currentDate: Dayjs) => {
    const isInRange =
      startDate &&
      (endDate
        ? currentDate.isSame(startDate, 'day') ||
        currentDate.isSame(endDate, 'day') ||
        (currentDate.isAfter(startDate, 'day') && currentDate.isBefore(endDate, 'day'))
        : currentDate.isSame(startDate, 'day'));

    if (isInRange) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: token.colorPrimary,
            borderRadius: 6,
            opacity: 0.3,
            zIndex: 1,
          }}
        />
      );
    }
    return null;
  };

  return (
    <div style={wrapperStyle}>
      <Typography.Text style={{textAlign: 'center', display: 'block', marginBottom: 8, backgroundColor: "white"}}>
        {startDate ? startDate.format('DD.MM.YYYY') : 'Izvoli datum'} {endDate ? ` - ${endDate.format('DD.MM.YYYY')}` : ''}
      </Typography.Text>
      <Calendar
        fullscreen={false}
        onSelect={onSelect}
        cellRender={cellRender}
        disabledDate={disabledDate}
      />
    </div>
  );
};

export default CalendarComponent;