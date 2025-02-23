export function FooterComponent() {
  return (
    <footer className="flex justify-between bg-Green-Custom border-t border-blue-gray-50 py-6 px-20">
      <div className="font-normal text-blue-gray-500">&copy; 202 Crazymax</div>
      <ul className="flex items-center gap-y-2 gap-x-8">
        <li>
          <a
            href="#"
            className="font-normal text-blue-gray-500 transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            เกี่ยวกับเรา
          </a>
        </li>
        <li>
          <a
            href="#"
            className="font-normal text-blue-gray-500 transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            สนับสนุน
          </a>
        </li>
        <li>
          <a
            href="#"
            className="font-normal text-blue-gray-500 transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            ติดต่อเรา
          </a>
        </li>
      </ul>
    </footer>
  );
}
