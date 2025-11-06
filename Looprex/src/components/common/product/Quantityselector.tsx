import styles from '../../../style/common.module.css';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export const QuantitySelector = ({ 
  quantity, 
  onChange, 
  max = 99, 
  min = 1 
}: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    onChange(clampedValue);
  };

  return (
    <div className={styles.quantitySelector}>
      <button 
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={styles.quantityButton}
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      
      <input 
        type="number"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        className={styles.quantityInput}
      />
      
      <button 
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={styles.quantityButton}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
};