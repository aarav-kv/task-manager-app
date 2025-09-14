import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function SortDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Active Timer');
    const dropdownRef = useRef(null);

    const sortOptions = [

        { value: 'name', label: 'Name' },
        { value: 'date', label: 'Date modified' },
        { value: 'timer', label: 'Active Timer' },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="dropdown-container-sort" ref={dropdownRef}>
            <span
                className="sort-button"
                onClick={toggleDropdown}
            >
                <span className="sort-content">
                    <span>Sort by</span>
                    <ChevronDown
                        size={16}
                        className={`chevron ${isOpen ? 'rotated' : ''}`}
                    />
                </span>
            </span>

            <div className={`dropdown-menu-sort ${isOpen ? 'open' : ''}`}>
                {sortOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`dropdown-item-sort ${selectedOption === option.label ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option.label}
                        {selectedOption === option.label && (
                            <div className="selected-indicator"></div>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
        .dropdown-container-sort {
          position: relative;
          display: inline-block;
        }

        .sort-button {
          display: flex;
          gap: 5px;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0.148);
          border-radius: 20px;
          font-size: 10px;
          user-select: none;
          box-sizing: border-box;
          padding: 8px 13px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 80px;
        }

        .sort-button:hover {
          background: #f8f9fa;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .sort-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .chevron {
          transition: transform 0.3s ease;
          margin-top: 1px;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu-sort {
          position: absolute;
          top: calc(100% + -3px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.148);
          border-radius: 12px;
          box-shadow: 2px 13px 20px 2px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top;
          width:150px
        }

        .dropdown-menu-sort.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .dropdown-item-sort {
          padding: 10px 13px;
          font-size: 10px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-item-sort:hover {
          background: #f8f9fa;
        }

        .dropdown-item-sort:not(:last-child) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .dropdown-item-sort.selected {
          background: #e3f2fd;
          color: #1976d2;
          font-weight: 500;
        }

        .selected-indicator {
          width: 6px;
          height: 6px;
          background: #1976d2;
          border-radius: 50%;
          margin-left: 8px;
        }
      `}</style>
        </div>
    );
};


