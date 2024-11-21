// importazioni
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

// modulo stile
import style from '../components/Main.module.css';

// array post iniziali
const initialPostsData = {
    title: '',
    slug: '',
    content: '',
    image: '',
    tags: [
        "Dolci",
        "Torte",
        "Ricette vegetariane",
        "Ricette al forno",
        "Antipasti",
        "Primi piatti",
        "Dolci veloci",
        "Ricette veloci",
        "Dolci al cioccolato", // * pool di tag temporaneo, trovare un modo per sistemarlo bene
    ]
};

// * SCALETTA *:
// - crea router anche su lato React
// - crea componente per slug
// - collega componente al router
// - decidi il metodo HTTP da usare e applica la logica giusta

export default function Main() {
    const [postsData, setPostsData] = useState(initialPostsData); // variabile per aggiungere post
    const [postList, setPostList] = useState([]); // variabile fetch

    // funzione fetch
    function fetchData(url = 'http://localhost:3000/posts') {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                setPostList(data.data);
            })
    }

    // stateEffect per usare fetchData al caricamento della pagina
    useEffect(fetchData, []);

    // funzione per aggiungere un post nuovo
    function addPost(e) {
        e.preventDefault();
        console.log('form sent', postsData);

        // generazione automatica di slug
        const newSlug = postsData.slug;

        // .toLowerCase(), .replace()
        if (!newSlug) {
            newSlug = postsData.title.toLowerCase().replace(/\s+/g, '-');
        }

        // clonazione oggetto
        const newPost = {
            title: postsData.title,
            slug: newSlug || postsData.slug,
            content: postsData.content,
            image: postsData.image,
            tags: postsData.tags
        };

        // richiesta POST al backend
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Post added', data);

                fetchData();

                setPostsData(initialPostsData);
            })
            .catch(err => {
                console.error('Error adding post', err);
            })
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
        const postIndexTrash = e.target.getAttribute('data-slug');

        // test per capire se trova lo slug o meno (errore DELETE null)
        console.log('Post to delete:', postIndexTrash);

        if (!postIndexTrash) {
            console.error('No slug found!');
            return;
        }

        // richiesta DELETE al backend
        fetch(`http://localhost:3000/posts/${postIndexTrash}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                console.log('Post deleted', data);

                // eliminare con filter
                const newPosts = postList.filter(post => post.slug !== postIndexTrash);

                // aggiornamento UI
                setPostList(newPosts);
            })
            .catch(err => {
                console.error('Error deleting post', err);
            })
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
                                name="title"
                                placeholder="Titolo nuovo post"
                                value={postsData.name}
                                onChange={handleFormField}
                                required />

                            {/* input immagine */}
                            <input type="text"
                                id="textImageInput"
                                name="image"
                                placeholder="URL immagine"
                                value={postsData.image}
                                onChange={handleFormField}
                                required />

                            {/* input contenuto */}
                            <textarea
                                id="descInput"
                                name="description"
                                placeholder="Contenuto post..."
                                value={postsData.description}
                                onChange={handleFormField}
                                required>
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
                            {postList.length ? postList.map((post, index) => <li key={index}>
                                <div className={style.card}>
                                    <h2>

                                        {/* prova: aggiungi un modo per accedere allo slug giusto */}
                                        <a href={`http://localhost:3000/posts/${post.slug}`}>
                                            {post.title}
                                        </a>
                                    </h2>
                                    <img src={`http://localhost:3000/${post.image}`} alt={post.title} />
                                    <p>
                                        {post.content}
                                    </p>
                                    <p>
                                        {post.category}
                                    </p>
                                    <div className={style.tags}>
                                        <h2>
                                            Tags:
                                        </h2>
                                        <p>
                                            {post.tags.join(', ')}
                                        </p>
                                    </div>
                                    <p>
                                        {post.public ? 'Post pubblico' : 'Post privato'}
                                    </p>
                                </div>

                                {/* RICORDA: inserire sempre type=button per bottoni non per POST, o va in submit per default */}
                                <button type="button" onClick={handleTrashPost} data-slug={post.slug || newSlug}>
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