import { CSSProperties, useCallback, useEffect, useState } from 'react';
import styles from './dateBar.module.css';
import { CustomButton } from '../Button/customButton';
import { DatePicker, theme } from 'antd';
import dayjs from 'dayjs';
import type { CellRenderInfo } from 'rc-picker/es/interface';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RangeValue } from 'src/types';

dayjs.extend(customParseFormat);

type DateBarProps = {
    setDates: (val: RangeValue) => void;
};

function DateBar(props: DateBarProps) {
    const { setDates } = props;

    const [value, setValue] = useState<RangeValue>(null);
    const [dateHighlight, setDateHighlight] = useState<string[]>([]);

    const { RangePicker } = DatePicker;

    const { token } = theme.useToken();

    const style: CSSProperties = {
        border: `1px solid ${token.colorPrimary}`,
        borderRadius: '50%'
    };
    const cellRender = useCallback(
        (current: number | dayjs.Dayjs, info: CellRenderInfo<dayjs.Dayjs>) => {
            if (info.type !== 'date') {
                return info.originNode;
            }
            if (typeof current === 'number') {
                return <div className="ant-picker-cell-inner">{current}</div>;
            }
            return (
                <div
                    className="ant-picker-cell-inner"
                    style={dateHighlight.includes(current.format('YYYY-MM-DD')) ? style : {}}
                >
                    {current.date()}
                </div>
            );
        },
        [dateHighlight]
    );

    useEffect(() => {
        window.dateBarAPI
            .dateBarHighlights()
            .then((d) => {
                setDateHighlight(d);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // for ux reasons (albeit good or bad), we want
    // to clear the date range when
    // the user opens the date picker again
    const onOpenChange = (open: boolean) => {
        if (open) setValue([null, null]);
    };

    return (
        <div className={styles.container}>
            <div>
                <RangePicker
                    onCalendarChange={(val) => {
                        setValue(val);
                    }}
                    changeOnBlur
                    onChange={(val) => {
                        setValue(val);
                    }}
                    onOpenChange={onOpenChange}
                    value={value}
                    cellRender={cellRender}
                    format={'DD.MM.YYYY'}
                />
            </div>
            <CustomButton text="Etsi" onClick={() => setDates(value)} role="submit" />
        </div>
    );
}

export default DateBar;
