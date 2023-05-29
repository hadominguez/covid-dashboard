import PropTypes from 'prop-types';

export default function Card(props) {
    const { title, value } = props;

    return (
        <div className="summary-card">
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string,
    value: PropTypes.number,
};