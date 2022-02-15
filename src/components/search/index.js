import { useState } from 'react';
import { clients, statuses } from '../../db/list';

const Clients = () => {
  const [search, setSearch] = useState('');
  const [stateForStatus, setStateForStatus] = useState(clients.list);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(() => e.target.value);
  }

  const onStatusChange = (id) => {
    setStateForStatus((prev) => {
      const newStatus = prev[id].status === 1 ? 2 : 1;
      const newObj = { ...prev[id], status: newStatus };
      return { ...prev, [id]: newObj };
    });
  }

  const data = Object.entries(stateForStatus);
  const getStatus = (statusCode) => statuses.status.find(({ code }) => code === statusCode);

  const visibleData = search === ''
    ? []
    : data.filter(([, { firstName, lastName }]) => firstName.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || lastName.toLowerCase().indexOf(search.toLowerCase()) !== -1);

  const view = visibleData
    .map(([key, { firstName, lastName, patronymic, status }]) => (
      <li key={ key }>
        <span>{`${ firstName } ${ lastName } ${ patronymic }`}</span><br />
        <button onClick={() => onStatusChange(key)}>Изменить статус</button><span>{ `Статус: ${ getStatus(status).statusText }` }</span>
      </li>));

  return (
    <div>
      <h1>Contacts</h1>
      <input type="search" name="search" value={search} onInput={handleSearch} placeholder="search..."/>
      <ul>
        {view}
      </ul>
    </div>
  );
};

export default Clients;
