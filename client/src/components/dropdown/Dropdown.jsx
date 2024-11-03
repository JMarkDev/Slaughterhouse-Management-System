import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import PropTypes from "prop-types";

export default function Dropdown({ data, option, handleFilter }) {
  const [selectOption, setSelectOption] = useState(option);

  const handleOption = (selected) => {
    setSelectOption(selected);
    handleFilter(selected);
  };

  return (
    <div className="text-right ">
      <Menu>
        <MenuButton className="inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-1.5 px-2 text-sm font-semibold text-white ">
          {selectOption}
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="bg-white"
        >
          <MenuItems
            anchor="bottom end"
            className="min-w-40 text-gray-700 origin-top-right bg-gray-700  rounded-xl  p-1 text-sm"
          >
            <MenuItem>
              <button
                onClick={() => handleOption(option)}
                className="group flex w-full text-sm  hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
              >
                {option}
              </button>
            </MenuItem>
            {data.map((options) => (
              <MenuItem key={options}>
                <button
                  onClick={() => handleOption(options)}
                  className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
                >
                  {options}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

Dropdown.propTypes = {
  data: PropTypes.array,
  option: PropTypes.any,
  handleFilter: PropTypes.func,
};
