export function requireAuth(router) {

  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return false;
  }

  return true;
}
