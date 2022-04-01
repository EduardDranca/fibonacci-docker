import { Link } from 'react-router-dom';

const OtherPage =  () => {
    return (
        <div>
            Other page.
            <Link to="/">Go back home</Link>
        </div>
    );
};

export default OtherPage;