import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { motion } from 'motion/react'
import { IconArrowUpRight, IconMessageCircle, IconPictureInPicture, IconShieldCheck } from '@tabler/icons-react'
import { userAtom } from '../UserAtom'
import { Page, PageHeader, listVariants, itemVariants } from '../ui/Page'

const tools = [
  { icon: IconPictureInPicture, title: 'All Events', text: 'Browse every event on the platform.', path: '/events' },
  { icon: IconShieldCheck, title: 'Approvals', text: 'Review and approve submitted events.', path: '/manageEvents' },
  { icon: IconMessageCircle, title: 'Moderation', text: 'Keep event comments respectful.', path: '/events' },
]

function AdminDashBoard() {
  const user = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const base = `/admin-profile/${user?.email}`

  return (
    <Page className="max-w-5xl">
      <PageHeader title="Admin Dashboard" subtitle="Oversee events and community activity" />
      <motion.div variants={listVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {tools.map(({ icon: Icon, title, text, path }) => (
          <motion.button
            key={title}
            variants={itemVariants}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`${base}${path}`)}
            className="glass group flex flex-col items-start rounded-3xl p-6 text-left"
          >
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
              <Icon size={22} stroke={1.8} />
            </span>
            <h3 className="mb-1 flex items-center gap-1 font-semibold text-white">
              {title}
              <IconArrowUpRight size={16} className="opacity-0 transition group-hover:opacity-100" />
            </h3>
            <p className="text-sm text-neutral-400">{text}</p>
          </motion.button>
        ))}
      </motion.div>
    </Page>
  )
}

export default AdminDashBoard
