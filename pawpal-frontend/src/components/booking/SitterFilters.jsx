import { useState } from "react";
import "./SitterFilters.css";

const EMPTY_FILTERS = {
  service: "",
  city: "",
  state: "",
  zipCode: "",
  minRating: "",
};

function SitterFilters({
  services,
  initialFilters,
  onApply,
  isLoading,
  servicesError,
}) {
  const [values, setValues] = useState({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValue =
      name === "state" ? value.toUpperCase().slice(0, 2) : value;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: nextValue,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onApply({
      service: values.service.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      zipCode: values.zipCode.trim(),
      minRating: values.minRating,
    });
  }

  function handleClear() {
    setValues(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  }

  return (
    <form className="sitter-filters" onSubmit={handleSubmit}>
      <div className="sitter-filters__heading">
        <div>
          <h2>Find the right sitter</h2>
          <p>Filter by service, location, or rating.</p>
        </div>

        <button
          className="sitter-filters__clear"
          type="button"
          onClick={handleClear}
          disabled={isLoading}
        >
          Clear filters
        </button>
      </div>

      <div className="sitter-filters__grid">
        <div className="sitter-filters__field">
          <label htmlFor="sitter-service">Service</label>

          <select
            id="sitter-service"
            name="service"
            value={values.service}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="">All services</option>

            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          {servicesError && (
            <p className="sitter-filters__field-message">
              Service choices could not be loaded.
            </p>
          )}
        </div>

        <div className="sitter-filters__field">
          <label htmlFor="sitter-city">City</label>

          <input
            id="sitter-city"
            name="city"
            type="text"
            value={values.city}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Chicago"
            autoComplete="address-level2"
          />
        </div>

        <div className="sitter-filters__location-group">
          <div className="sitter-filters__field">
            <label htmlFor="sitter-state">State</label>

            <input
              id="sitter-state"
              name="state"
              type="text"
              value={values.state}
              onChange={handleChange}
              disabled={isLoading}
              maxLength="2"
              placeholder="IL"
              autoComplete="address-level1"
            />
          </div>

          <div className="sitter-filters__field">
            <label htmlFor="sitter-zip">ZIP code</label>

            <input
              id="sitter-zip"
              name="zipCode"
              type="text"
              value={values.zipCode}
              onChange={handleChange}
              disabled={isLoading}
              maxLength="10"
              placeholder="60601"
              autoComplete="postal-code"
            />
          </div>
        </div>

        <div className="sitter-filters__field">
          <label htmlFor="sitter-rating">Minimum rating</label>

          <select
            id="sitter-rating"
            name="minRating"
            value={values.minRating}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="">Any rating</option>
            <option value="1">1 star and above</option>
            <option value="2">2 stars and above</option>
            <option value="3">3 stars and above</option>
            <option value="4">4 stars and above</option>
            <option value="5">5 stars</option>
          </select>
        </div>
      </div>

      <div className="sitter-filters__actions">
        <button
          className="sitter-filters__submit"
          type="submit"
          disabled={isLoading}
        >
          <i className="fi fi-rr-search" aria-hidden="true" />
          {isLoading ? "Searching..." : "Search sitters"}
        </button>
      </div>
    </form>
  );
}

export default SitterFilters;