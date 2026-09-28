export default function StaffNotice({ children }) {
  return (
    <p className="staff-notice" role="note">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 2.5 20h19L12 3.5Z" />
        <path d="M12 10v4.5M12 17.2v.1" />
      </svg>
      <span>{children}</span>
    </p>
  )
}
