import DotLoader from "../../components/DotLoader/DotLoader"
import styles from './styles.module.css';


const LoadingPage = () => {
    return <>
        <div className={styles.loading__Page}>
            <DotLoader />
        </div>
    </>
}

export default LoadingPage;