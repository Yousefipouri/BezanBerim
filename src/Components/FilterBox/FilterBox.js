import React, { useState, useEffect } from 'react';

const FilterBox = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        isNature: '',
        isReligious: '',
        isHistorical: '',
        isIndoor: '',
        city: '',
        sort: ''
    });

    useEffect(() => {
        onFilterChange(filters);  // ارسال فیلترها به `Home` در هر تغییر
    }, [filters, onFilterChange]);

    const handleChange = (e) => {
        const { name, checked, value, type } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
        }));
    };

    return (
        <div className="d-flex align-items-center mb-4 border p-lg-3 p-md-3 p-sm-1 p-1 rounded shadow-sm bg-light">
            <label className="me-lg-3 me-md-3 me-sm-1 me-1">
                <input
                    type="checkbox"
                    name="isNature"
                    checked={filters.isNature === 'true'}
                    onChange={handleChange}
                />
                طبیعت
            </label>
            <label className="me-lg-3 me-md-3 me-sm-1 me-1">
                <input
                    type="checkbox"
                    name="isReligious"
                    checked={filters.isReligious === 'true'}
                    onChange={handleChange}
                />
                مذهبی
            </label>
            <label className="me-lg-3 me-md-3 me-sm-1 me-1">
                <input
                    type="checkbox"
                    name="isHistorical"
                    checked={filters.isHistorical === 'true'}
                    onChange={handleChange}
                />
                تاریخی
            </label>
            <label className="me-lg-3 me-md-3 me-sm-1 me-1">
                <input
                    type="checkbox"
                    name="isIndoor"
                    checked={filters.isIndoor === 'true'}
                    onChange={handleChange}
                />
                سرپوشیده
            </label>
            <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="شهر"
                className="form-control me-lg-3 me-md-3 me-sm-1 me-1"
                style={{ maxWidth: '150px' }}
            />

            <select name="sort" value={filters.sort} onChange={handleChange} className="form-control"> 
                <option value="">مرتب‌سازی</option> 
                <option value="time">بر اساس زمان</option>
                <option value="likes">بر اساس محبوب ترین ها</option>
             </select>

        </div>
    );
};

export default FilterBox;
