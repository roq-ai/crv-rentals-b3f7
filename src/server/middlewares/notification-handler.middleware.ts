import { getServerSession } from '@roq/nextjs';
import { NextApiRequest } from 'next';
import { NotificationService } from 'server/services/notification.service';
import { convertMethodToOperation, convertRouteToEntityUtil, HttpMethod, generateFilterByPathUtil } from 'server/utils';
import { prisma } from 'server/db';

interface NotificationConfigInterface {
  roles: string[];
  key: string;
  tenantPath: string[];
  userPath: string[];
}

const notificationMapping: Record<string, NotificationConfigInterface> = {
  'tool.create': { roles: ['owner'], key: 'tool-added', tenantPath: ['company', 'tool'], userPath: [] },
  'tool.update': { roles: ['owner'], key: 'tool-updated', tenantPath: ['company', 'tool'], userPath: [] },
  'tool.delete': { roles: ['owner'], key: 'tool-deleted', tenantPath: ['company', 'tool'], userPath: [] },
  'outlet.update': { roles: ['owner'], key: 'outlet-updated', tenantPath: ['company', 'outlet'], userPath: [] },
  'outlet.delete': { roles: ['owner'], key: 'outlet-deleted', tenantPath: ['company', 'outlet'], userPath: [] },
  'rental.create': {
    roles: ['owner', 'admin'],
    key: 'rental-started',
    tenantPath: ['company', 'tool', 'rental'],
    userPath: [],
  },
  'rental.update': {
    roles: ['owner', 'admin'],
    key: 'rental-ended',
    tenantPath: ['company', 'tool', 'rental'],
    userPath: [],
  },
  'user.delete': { roles: ['admin'], key: 'admin-removed', tenantPath: ['company', 'user'], userPath: [] },
};

const ownerRoles: string[] = ['owner'];
const customerRoles: string[] = ['customer'];
const tenantRoles: string[] = ['owner', 'admin'];

const allTenantRoles = tenantRoles.concat(ownerRoles);
export async function notificationHandlerMiddleware(req: NextApiRequest, entityId: string) {
  const session = getServerSession(req);
  const { roqUserId } = session;
  // get the entity based on the request url
  let [mainPath] = req.url.split('?');
  mainPath = mainPath.trim().split('/').filter(Boolean)[1];
  const entity = convertRouteToEntityUtil(mainPath);
  // get the operation based on request method
  const operation = convertMethodToOperation(req.method as HttpMethod);
  const notificationConfig = notificationMapping[`${entity}.${operation}`];

  if (!notificationConfig || notificationConfig.roles.length === 0 || !notificationConfig.tenantPath?.length) {
    return;
  }

  const { tenantPath, key, roles, userPath } = notificationConfig;

  const tenant = await prisma.company.findFirst({
    where: generateFilterByPathUtil(tenantPath, entityId),
  });

  if (!tenant) {
    return;
  }
  const sendToTenant = () => {
    console.log('sending notification to tenant', {
      notificationConfig,
      roqUserId,
      tenant,
    });
    return NotificationService.sendNotificationToRoles(key, roles, roqUserId, tenant.tenant_id);
  };
  const sendToCustomer = async () => {
    if (!userPath.length) {
      return;
    }
    const user = await prisma.user.findFirst({
      where: generateFilterByPathUtil(userPath, entityId),
    });
    console.log('sending notification to user', {
      notificationConfig,
      user,
    });
    await NotificationService.sendNotificationToUser(key, user.roq_user_id);
  };

  if (roles.every((role) => allTenantRoles.includes(role))) {
    // check if only  tenantRoles + ownerRoles
    await sendToTenant();
  } else if (roles.every((role) => customerRoles.includes(role))) {
    // check if only customer role
    await sendToCustomer();
  } else {
    // both company and user receives
    await Promise.all([sendToTenant(), sendToCustomer()]);
  }
}
