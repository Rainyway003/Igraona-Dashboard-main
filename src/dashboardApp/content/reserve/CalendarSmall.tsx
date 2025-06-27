import {Calendar, Tooltip} from 'antd';
import dayjs from 'dayjs';
import { useMemo} from 'react';
import {useList} from '@refinedev/core';

const CalendarSmall: React.FC<CalendarComponentProps> = () => {
    const {data: reservedData} = useList({
        resource: 'reserve',
    });

    const reservedDates = useMemo(() => {
        const list = (reservedData?.data || []).map((item) => {
            const dateObj = typeof item.date === 'object' && item.date?.toDate
                ? item.date.toDate()
                : new Date(item.date);

            return {
                date: dayjs(dateObj).startOf('day').format('YYYY-MM-DD'),
                name: item.name,
            }
        });

        return list;
    }, [reservedData]);

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
                const reservedEntry = reservedDates.find((d) => d.date === formatted);
                const isReserved = !!reservedEntry;


                const style: React.CSSProperties = {
                    width: '60%',
                    height: '60%',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontWeight: 'bold',
                    margin: '0 auto',
                    backgroundColor: '#8D151F',
                    color: '#fff',
                };

                const cellContent = isReserved ? <div style={style}>✔️</div> : null;

                return isReserved ? (
                    <Tooltip
                        title={`Rezervirao : ${reservedEntry.name}`}>{cellContent}</Tooltip>
                ) : cellContent;
            }}
        />
    );
};

export default CalendarSmall;