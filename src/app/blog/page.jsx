import CardList from "../components/CardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "../components/Menu/Menu";

const BlogPage = ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat}</h1>
      <div className={styles.content}>
        <CardList page={page} cat={cat}/>
        <Menu page={page}/>
      </div>
    </div>
  );
};

export default BlogPage;