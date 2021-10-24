  import { useEffect, useState, useRef } from 'react';
  import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

  import Widget from './Widget';
  import useWindowDimensions from './useWindowDimensions';

  import './App.scss';

  function App() {
    const { width } = useWindowDimensions();
    const [ data, setData ] = useState({});
    const [ fields, setfields] = useState({
      fromMonthIndex: 0,
      fromYearIndex: 0,
      toMonthIndex: 3,
      toYearIndex: 14
    });
    const fromMonthRef = useRef(null);
    const fromYearRef = useRef(null);
    const toMonthRef = useRef(null);
    const toYearRef = useRef(null);

    const transformData = (data) => {
      const keys = Object.keys(data);
      const list = [];

      for (let key of keys) {
        list.push({
          name: key,
          deg: data[key]
        });
      }

      return list;
    };

    const edit = (field, e) => {
      setfields({ ...fields, [field]: e.target.selectedIndex });
    };

    useEffect(() => {
      toMonthRef.current.selectedIndex = 3;
      toYearRef.current.selectedIndex = 14;
    }, []);

    useEffect(() => {
      const fromMonth = parseInt(fromMonthRef.current.options[fields.fromMonthIndex].value, 10);
      const fromYear = fromYearRef.current.options[fields.fromYearIndex].text;
      const toMonth = parseInt(toMonthRef.current.options[fields.toMonthIndex].value, 10);
      const toYear = toYearRef.current.options[fields.toYearIndex].text;
      const range = toMonth >= fromMonth  ? (toMonth - fromMonth) + 1 : (12 - fromMonth) + toMonth + 1;
  
      (async function() {
        const response = await fetch(`https://www.ncdc.noaa.gov/cag/global/time-series/globe/land_ocean/${range}/${toMonth}/${fromYear}-${toYear}/data.json`);
        const rawData = await response.json();

        rawData.formattedData = transformData(rawData.data);
        setData(rawData);
      })();
    }, [fields.fromMonthIndex, fields.fromYearIndex, fields.toMonthIndex, fields.toYearIndex]);

    return (
      <div className="app">
        <h1>{data?.description?.title}</h1>
        <div className="control-panel">
          <label className="item"><b>From:</b></label>
          <label>Month</label>
          <select className="select item" name="fromMonth" ref={fromMonthRef} onChange={(e) => edit('fromMonthIndex', e)}>
            <option value="3">March</option>
            <option value="6">June</option>
            <option value="9">September</option>
            <option value="12">December</option>
          </select>
          <label>Year</label>
          <select className="select item" name="fromYear" ref={fromYearRef} onChange={(e) => edit('fromYearIndex', e)}>
            <option>1880</option>
            <option>1890</option>
            <option>1900</option>
            <option>1910</option>
            <option>1920</option>
            <option>1930</option>
            <option>1940</option>
            <option>1950</option>
            <option>1960</option>
            <option>1970</option>
            <option>1980</option>
            <option>1990</option>
            <option>2000</option>
            <option>2010</option>
            <option>2020</option>
          </select>
          <label className="item"><b>To:</b></label>
          <label>Month</label>
          <select className="select item" name="toMonth" ref={toMonthRef} onChange={(e) => edit('toMonthIndex', e)}>
            <option value="3">March</option>
            <option value="6">June</option>
            <option value="9">September</option>
            <option value="12">December</option>
          </select>
          <label>Year</label>
          <select className="select item" name="toYear" ref={toYearRef} onChange={(e) => edit('toYearIndex', e)}>
            <option>1880</option>
            <option>1890</option>
            <option>1900</option>
            <option>1910</option>
            <option>1920</option>
            <option>1930</option>
            <option>1940</option>
            <option>1950</option>
            <option>1960</option>
            <option>1970</option>
            <option>1980</option>
            <option>1990</option>
            <option>2000</option>
            <option>2010</option>
            <option>2020</option>
          </select>
        </div>
        {!!width && (
          <LineChart width={width - 60} height={250} data={data?.formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[-1, 'dataMax']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="deg" name="Degrees (Celcius)" stroke="#8884d8" />
          </LineChart>
        )}
        <div className="parent-panel">
          <Widget title="Header">Content</Widget>
          <Widget title="Header 2">Content 2</Widget>
        </div>
      </div>
    );
  }

  export default App;
