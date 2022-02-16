import { useState, useEffect } from 'react';
import { clients, statuses } from '../../db/list';

const Clients = () => {
  const [search, setSearch] = useState('');
  const [stateForClients, setStateForClients] = useState(clients.list);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(() => e.target.value);
  }

  const onStatusChange = (id) => {
    setStateForClients((prev) => {
      const newStatus = prev[id].status === 1 ? 2 : 1;
      const newObj = { ...prev[id], status: newStatus };
      return { ...prev, [id]: newObj };
    });
  }

  const data = Object.entries(stateForClients);
  const getStatus = (statusCode) => statuses.status.find(({ code }) => code === statusCode);

  const filteredBySearch = search === ''
    ? []
    : data.filter(([, { firstName, lastName }]) => firstName.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || lastName.toLowerCase().indexOf(search.toLowerCase()) !== -1);

  const pageSize = 3;

  // get pages' nav
  const pages = [];

  for (let i = 1; i <= pagesCount; i += 1) {
    pages.push(i);
  }
  // get first and last indexes
  const getIndexes = (pageNumber) => {
    const lastIndex = pageNumber * pageSize;
    const firstIndex = lastIndex - pageSize;

    return { firstIndex, lastIndex };
  }

  const filteredByPage = (id) => {
    const { firstIndex, lastIndex } = getIndexes(id);
    return filteredBySearch.slice(firstIndex, lastIndex);
  };

  const visibleData = filteredByPage(currentPage);

  const onFilter = (id) => {
    setCurrentPage(id);
  };

  const view = visibleData
    .map(([key, { firstName, lastName, patronymic, status }]) => (
      <li key={ key }>
        <span>{`${ firstName } ${ lastName } ${ patronymic }`}</span><br />
        <button onClick={() => onStatusChange(key)}>Изменить статус</button><span>{ `Статус: ${ getStatus(status).statusText }` }</span>
      </li>));

  useEffect(() => {
    setPagesCount(Math.ceil(filteredBySearch.length / pageSize));
  }, [visibleData]);

  return (
    <div>
      <h1>Contacts</h1>
      <input type="search" name="search" value={search} onInput={handleSearch} placeholder="search..."/>
      <div>
        { pages.map((el) => <span onClick={() => onFilter(el)} className={currentPage === el && 'spanSelected' }>{el}</span>) }
      </div>
      <ul>
        {view}
      </ul>
    </div>
  );
};

export default Clients;
