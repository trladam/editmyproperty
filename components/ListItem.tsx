const ListItem = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-x-3">
      <svg
        className="h-6 w-5 flex-none text-blue-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clip-rule="evenodd"
        />
      </svg>
      {text}
    </div>
  );
};
export default ListItem;