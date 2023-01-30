import { useEffect } from 'react'
import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from 'react-router-dom'
import { getContacts, createContact } from '../contacts'

export async function loader({ request }: { request: any }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  console.log('url param::', q)
  const contacts = await getContacts(q);
  console.log('root loader::', contacts)
  return { contacts, q };
}
export async function action() {
  const contact = await createContact();
  console.log('root action::', contact)
  // return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData() as {contacts : any[], q: string};
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  /*
  // input为非受控组件时
  useEffect(() => {
    const inputValue = document.getElementById('q') as HTMLInputElement;
    console.log('search input::', inputValue.value, q)
    inputValue.value = q;
  }, [q]);
  */

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search"> {/* form没有指定method则默认为get，意味着当浏览器创建请求时，它不会将表单数据放入请求 POST 主体中，而是放入 GET 请求的 URLSearchParams 中。 */}
            {/* <input // 非受控组件
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q" // 浏览器可以通过input的name属性来序列化表单 ?q=
              defaultValue={q}
            /> */}
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                console.log('input change::', event.currentTarget.form)
                submit(event.currentTarget.form, {
                  // replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: any) => (
                <li key={contact.id}>
                  {/* <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link> */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}

          {/* <ul>
            <li>
              <a href={`/contacts/1`}>Your Name</a> // 注意与Link的区别
            </li>
            <li>
              <Link to={`/contacts/2`}>Your Friend</Link>
            </li>
          </ul> */}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}