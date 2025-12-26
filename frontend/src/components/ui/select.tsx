import * as React from "react"

export const Select = ({ children, value, onValueChange }: any) => {
    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange });
                }
                return child;
            })}
        </div>
    );
};

export const SelectTrigger = ({ children, className }: any) => (
    <div className={className}>{children}</div>
);

export const SelectValue = ({ placeholder, value }: any) => (
    <span>{value || placeholder}</span>
);

export const SelectContent = ({ children, value, onValueChange }: any) => (
    <div className="select-content">
        {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    isSelected: child.props.value === value,
                    onClick: () => onValueChange(child.props.value)
                });
            }
            return child;
        })}
    </div>
);

export const SelectItem = ({ children, value, onClick, isSelected }: any) => (
    <div onClick={onClick} className={isSelected ? "bg-accent" : ""}>
        {children}
    </div>
);
