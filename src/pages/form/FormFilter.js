import React from 'react'

const filterList = ['all',  'Java', 'C#', 'C++', 'Python']

export default function FormFilter({currentFilter,changeFilter}) {

    const handleClick = (newFilter) => {
        changeFilter(newFilter)
    }
    console.log(currentFilter)
  
    return (
      <div className="question-filter">
        <nav>
          <p>Filter by: </p>
          {filterList.map((f) => (
            <button key={f}
              onClick={() => handleClick(f)}
              className={currentFilter === f ? 'active' : ''}
            >{f}</button>
          ))}
        </nav>
      </div>
    )
}
