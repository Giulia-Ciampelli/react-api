// importazioni
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

// modulo stile
import style from '../components/Main.module.css';

// array post iniziali
const initialPostsData = {
    name: '',
    image: '',
    description: '',
    category: '', // *modifica temporanea?
    tags: [],
    public: false
};

export default function Main() {
    const [postsData, setPostsData] = useState(initialPostsData); // variabile per aggiungere post
    const [postList, setPostList] = useState([]); // variabile fetch

    // funzione fetch
    function fetchData(url = 'http://localhost:3000/posts') {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setPostList(data);
        })
    }

    // stateEffect per usare fetchData al caricamento della pagina
    useEffect(fetchData, []);

    // funzione per aggiungere un post nuovo
    function addPost(e) {
        e.preventDefault();
        console.log('form sent', postsData);

        // clonazione oggetto
        const newPost = {
            id: Date.now(),
            ...postsData
        };

        // aggiornamento UI
        setPostList([
            newPost,
            ...postList
        ]);

        setPostsData(initialPostsData);
    }

    // funzione onChange
    function handleFormField(e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setPostsData({
            ...postsData,
            [e.target.name]: value
        })
    }

    // funzione per cancellare post
    function handleTrashPost(e) {

        // trovare post giusto
        const postIndexTrash = Number(e.target.getAttribute('data-index'));

        // eliminare con filter
        const newPosts = postList.filter((index) => index != postIndexTrash);

        // aggiornamento UI
        setPostList(newPosts);
    }

    return (
        <main>
            <div className={style.container}>
                <div className={style.row}>
                    <form onSubmit={addPost}>

                        {/* #region input */}
                        <div className={style.addPost}>

                            {/* input nome */}
                            <input type="text"
                                id="textInput"
                                name="name"
                                placeholder="Titolo nuovo post"
                                value={postsData.name}
                                onChange={handleFormField} />

                            {/* input immagine */}
                            <input type="text"
                                id="textImageInput"
                                name="image"
                                placeholder="URL immagine"
                                value={postsData.image}
                                onChange={handleFormField} />

                            {/* input contenuto */}
                            <textarea
                                id="descInput"
                                name="description"
                                placeholder="Contenuto post..."
                                value={postsData.description}
                                onChange={handleFormField}>
                            </textarea>

                            {/* input select categoria */}
                            <select
                                id="selectInput"
                                name="category"
                                placeholder="Seleziona categoria post"
                                value={postsData.category}
                                onChange={handleFormField}>
                                <option value="1">
                                    cat1
                                </option>
                                <option value="2">
                                    cat2
                                </option>
                                <option value="3">
                                    cat3
                                </option>
                                <option value="4">
                                    cat4
                                </option>
                                <option value="5">
                                    cat5
                                </option>
                            </select>

                            {/* input checkbox tags */}
                            <input type="checkbox"
                                id="checkInput1"
                                name="tag1"
                                value={postsData.tags}
                                onChange={handleFormField} />
                            <label>
                                Tag1
                            </label>
                            <input type="checkbox"
                                id="checkInput2"
                                name="tag2"
                                value={postsData.tags}
                                onChange={handleFormField} />
                            <label>
                                Tag2
                            </label>
                            <input type="checkbox"
                                id="checkInput3"
                                name="tag3"
                                value={postsData.tags}
                                onChange={handleFormField} />
                            <label>
                                Tag3
                            </label>

                            {/* input pubblica o meno */}
                            <input type="checkbox"
                                id="checkInputPublic"
                                name="public"
                                value={postsData.public}
                                onChange={handleFormField} />
                            <label>
                                Post pubblico
                            </label>

                            {/* bottone submit */}
                            <button type="submit">
                                Aggiungi post
                            </button>
                        </div>
                        {/* #endregion input */}

                        {/* #region output */}
                        <ul>
                            {postList?.data ? postList?.data.map((post, index) => <li key={index}>
                                <div className={style.card}>
                                    <p>
                                        {post.title}
                                    </p>
                                    <img src={post.image} alt={post.title} />
                                    <p>
                                        {post.content}
                                    </p>
                                    <p>
                                        {post.category}
                                    </p>
                                    <p>
                                        {post.tags}
                                    </p>
                                    <p>
                                        {post.public ? 'Post pubblico' : 'Post privato'}
                                    </p>
                                </div>
                                <button onClick={handleTrashPost} data-index={index}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </li>) : <p>No posts yet</p>}
                        </ul>
                        {/* #endregion output */}
                    </form>
                </div>
            </div>
        </main>
    )
}