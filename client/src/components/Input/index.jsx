import React from 'react'
import PropTypes from 'prop-types'
import { ErrorMessage } from '../../components/ErrorMessage'

const Input = React.forwardRef(
   (
      {
         wrapClassName = '',
         className = '',
         name = '',
         placeholder = '',
         type = 'text',
         children,
         errors = [],
         value,
         label = '',
         prefix,
         suffix,
         onChange,
         onFocos,
         onBlur,
         shape = '',
         size = '',
         variant = '',
         color = '',
         ...restProps
      },
      ref
   ) => {
      const handleChange = (e) => {
         if (onChange) onChange(e?.target?.value)
      }
      const handleBlur = (e) => {
         if (onBlur) onBlur(e?.target?.value)
      }
      const handleFocos = (e) => {
         if (onFocos) onFocos(e?.target?.value)
      }
      return (
         <>
            <div
               className={`${wrapClassName} 
               
               
              `}
            >
               {!!label && label}
               {!!prefix && prefix}
               <input
                  ref={ref}
                  className={`${className} bg-transparent border-0`}
                  type={type}
                  name={name}
                  onChange={handleChange}
                  onFocus={handleFocos}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  value={value}
                  {...restProps}
               />
               {!!suffix && suffix}
            </div>
            {!!errors && <ErrorMessage errors={errors} />}
         </>
      )
   }
)

Input.propTypes = {
   wrapClassName: PropTypes.string,
   className: PropTypes.string,
   name: PropTypes.string,
   placeholder: PropTypes.string,
   type: PropTypes.string,
}

export { Input }
